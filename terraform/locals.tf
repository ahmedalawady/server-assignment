locals {
  common_tags = {
    project      = var.project
    billing_code = var.billing_code
    environment  = terraform.workspace
  }
  name_prefix    = "${var.naming_prefix}-${lower(terraform.workspace)}"
  vpc_cidr_block = [for subnet in range(sum([var.vpc_public_subnet_count[terraform.workspace], var.vpc_private_subnet_count[terraform.workspace]])) : cidrsubnet(var.vpc_cidr_block[terraform.workspace], 8, subnet)]
}