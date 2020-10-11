#!/bin/bash

#to get pemFileDirectory - open terminal, drag folder containing .pem file into terminal. Then copy and paste resulting filepath, below
pemFileDirectory=[[[Replace with pemFileDirectory, see abovefor more info]]]
pemFileName=[[[Replace with name of .pem filefor the AWS instance you are trying to ssh to]]]
#You might have to update this if the instance was stopped/terminated and then run again since the last time you used it
AWSInstanceIP=[[[Replace with AWS instance IP address]]]

cd $pemFileDirectory

ssh -i $pemFileName.pem ec2-user@$AWSInstanceIP

