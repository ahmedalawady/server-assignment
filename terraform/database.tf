##################################################################################
# RESOURCES
##################################################################################
resource "aws_db_subnet_group" "customer-services" {
  name       =  "${local.name_prefix}-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

resource "aws_db_instance" "customer-services-db" {
  identifier        = "${local.name_prefix}-db"
  engine            = "mysql"
  engine_version    = "5.7"
  instance_class    = var.rds_instance_type[terraform.workspace]
  allocated_storage = 20
  storage_type      = "gp2"
  db_name           = var.database_name
  username          = "admin"
  # export TF_VAR_db_password="password"
  password                = var.db_password
  parameter_group_name    = "default.mysql5.7"
  publicly_accessible     = true
  backup_retention_period = 7
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_db_subnet_group.customer-services.name
  vpc_security_group_ids = [
    aws_security_group.cs-db.id
  ]

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-db"
  })
}

# resource "aws_elasticache_cluster" "example" {
#   cluster_id           = "cluster-example"
#   engine               = "redis"
#   node_type            = "cache.m4.large"
#   num_cache_nodes      = 1
#   parameter_group_name = "default.redis3.2"
#   engine_version       = "3.2.10"
#   port                 = 6379
# }