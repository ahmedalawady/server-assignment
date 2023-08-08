# General Variables 
variable "naming_prefix" {
  type        = string
  description = "Naming prefix for resources"
  default     = "cs"
}

# Network Variables
variable "vpc_cidr_block" {
  type        = map(string)
  description = "Base CIDR Block for VPC"
}

variable "project_id" {
  type        = string
  description = "Project ID for Google Cloud Resources"
}

variable "network_name" {
  type        = string
  description = "Network name for Google Cloud VPC"
}

variable "region" {
  type        = string
  description = "Region for Google Cloud Resources"
  default     = "us-central1"
}


# Instances Variables
variable "instance_type" {
  type        = map(string)
  description = "Type for EC2 Instnace"
}

# Database Variables
variable "rds_instance_type" {
  type        = map(string)
  description = "Type for RDS Instance"
}

variable "database_name" {
  type        = string
  description = "Name of the database to create"
  default     = "cs_db"
}

variable "db_password" {
  type        = string
  description = "Password for the database"
}

# Tags Variables
variable "project" {
  type        = string
  description = "Project name for resource tagging"
  default     = "Customer Services"
}

variable "billing_code" {
  type        = string
  description = "Billing code for resource tagging"
  default     = "cs-1"
}