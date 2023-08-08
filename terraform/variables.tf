# General Variables 
variable "region" {
  type        = string
  description = "Region for Google Cloud Resources"
  default     = "us-central1"
}

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

variable "enable_dns_hostnames" {
  type        = bool
  description = "Enable DNS hostnames in VPC"
  default     = true
}

variable "map_public_ip_on_launch" {
  type        = bool
  description = "Map public IP on launch"
  default     = true
}

variable "vpc_public_subnet_count" {
  type        = map(number)
  description = "Number of public subnets to create"
}

variable "vpc_private_subnet_count" {
  type        = map(number)
  description = "Number of private subnets to create"
}


# Instances Variables
variable "machine_type" {
  type        = map(string)
  description = "Type for Google Cloud Instance"
}

# Database Variables
variable "sql_instance_type" {
  type        = map(string)
  description = "Type for Google Cloud SQL Instance"
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