provider "aws" {
  region = "us-east-1" 
}

data "aws_iam_policy_document" "ecs_task_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}


resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "main_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }
}

resource "aws_route_table_association" "public_subnet_assoc" {
  subnet_id      = aws_subnet.main_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.main_vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecr_repository" "app_repo" {
  name = "nest-app-repo"
}

resource "aws_ecs_cluster" "main_cluster" {
  name = "cluster-nest-fargate"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "nest-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = jsonencode([{
    name      = "nest-container"
    image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
    environment = [
      { name = "PORT", value = "80" },
      { name = "SUPABASE_URL", value = "https://sfqhpphdpuwifhosatxr.supabase.co" },
      { name = "SUPABASE_KEY", value = "sb_publishable_DyylpfiLiLHK4DmWBOYY4Q_O42ZLVxP" }
    ]
    portMappings = [{ containerPort = 80, hostPort = 80 }]
  }])
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecsTaskExecutionRole-nest"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "app_service" {
  name            = "nest-service"
  cluster         = aws_ecs_cluster.main_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.main_subnet.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}