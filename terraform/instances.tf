
resource "aws_key_pair" "customer-services-key" {
  key_name   = "${local.name_prefix}-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_instance" "customer-services-instance" {
  ami                    = "ami-0c2b8ca1dad447f8a"
  instance_type          = var.instance_type[terraform.workspace]
  subnet_id              = module.vpc.public_subnets[0]
  vpc_security_group_ids = [aws_security_group.cs-db.id, aws_security_group.cs-nginx.id]
  key_name               = aws_key_pair.customer-services-key.key_name
  user_data              = <<EOF
#!/bin/bash
cd /tmp
echo '#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm i 16.17.0
sudo yum update
sudo yum install -y git
curl -o- -L https://yarnpkg.com/install.sh | bash
sudo yum install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo ln -s /home/ec2-user/.nvm/versions/node/v16.17.0/bin/node /usr/bin
sudo ln -s /home/ec2-user/.nvm/versions/node/v16.17.0/bin/npm /usr/bin
sudo ln -s /home/ec2-user/.yarn/bin/yarn /usr/bin
sudo yarn global add pm2
sudo ln -s /usr/local/bin/pm2 /usr/bin' >> init.sh
chmod +x init.sh
/bin/su -c "/tmp/init.sh" - ec2-user
rm init.sh
EOF

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-server"
  })
}