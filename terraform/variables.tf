variable "aws_region" {
  description = "AWS region where the infrastructure will be created."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr_block" {
  description = "CIDR block for the public subnet."
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone for the subnet."
  type        = string
  default     = "us-east-1a"
}

variable "container_port" {
  description = "Port exposed by the application container."
  type        = number
  default     = 80
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository."
  type        = string
  default     = "nest-app-repo"
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  type        = string
  default     = "cluster-nest-fargate"
}

variable "ecs_task_family" {
  description = "ECS task definition family name."
  type        = string
  default     = "nest-task"
}

variable "ecs_task_cpu" {
  description = "Fargate CPU units for the task."
  type        = string
  default     = "256"
}

variable "ecs_task_memory" {
  description = "Fargate memory for the task."
  type        = string
  default     = "512"
}

variable "container_name" {
  description = "Container name inside the task definition."
  type        = string
  default     = "nest-container"
}

variable "image_tag" {
  description = "ECR image tag to deploy."
  type        = string
  default     = "latest"
}

variable "ecs_service_name" {
  description = "Name of the ECS service."
  type        = string
  default     = "nest-service"
}

variable "desired_count" {
  description = "Number of ECS tasks to keep running."
  type        = number
  default     = 1
}

variable "supabase_url" {
  description = "Supabase project URL."
  type        = string
}

variable "supabase_key" {
  description = "Supabase API key."
  type        = string
  sensitive   = true
}
