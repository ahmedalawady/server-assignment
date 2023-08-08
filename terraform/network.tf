##################################################################################
# DATA
##################################################################################

data "aws_availability_zones" "available" {}


##################################################################################
# RESOURCES
##################################################################################

#Network

module "vpc" {
  source  = "terraform-google-modules/network/google"
  version = "~> 3.0"

  project_id   = var.project_id
  network_name = var.network_name
  routing_mode = "GLOBAL"

  subnets = [
    {
      subnet_name   = "subnet-01"
      subnet_ip     = var.vpc_cidr_block[terraform.workspace]
      subnet_region = var.region
    },
  ]

  secondary_ranges = {
    subnet-01 = []
  }
}

##################################################################################
# SECURITY
##################################################################################

resource "google_compute_firewall" "cs-nginx" {
  name    = "nginx"
  network = module.vpc.network_name

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["nginx"]
}

resource "google_compute_firewall" "cs-db" {
  name    = "cs-db"
  network = module.vpc.network_name

  allow {
    protocol = "tcp"
    ports    = ["3306"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["db"]
}