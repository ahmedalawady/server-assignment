##################################################################################
# DATA
##################################################################################

data "aws_availability_zones" "available" {}


##################################################################################
# RESOURCES
##################################################################################

#Network

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  cidr            = var.vpc_cidr_block[terraform.workspace]
  azs             = slice(data.aws_availability_zones.available.names, 0, (length(local.vpc_cidr_block)))
  public_subnets  = slice(local.vpc_cidr_block, 0, (var.vpc_public_subnet_count[terraform.workspace]))
  private_subnets = slice(local.vpc_cidr_block, (var.vpc_public_subnet_count[terraform.workspace]), (length(local.vpc_cidr_block)))

  enable_nat_gateway      = false
  enable_dns_hostnames    = var.enable_dns_hostnames
  map_public_ip_on_launch = var.map_public_ip_on_launch

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })

}

##################################################################################
# SECURITY
##################################################################################

resource "aws_security_group" "cs-nginx" {
  name        = "nginx"
  description = "Allow HTTP traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP"
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

  tags = local.common_tags
}

resource "aws_security_group" "cs-db" {
  name        = "cs-db"
  description = "Allow MySQL traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "MySQL"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }


  tags = local.common_tags
}
