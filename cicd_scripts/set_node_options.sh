#! /bin/bash
#
#   SCRIPT SETS NODE MEMORY TO 192 MB LESS THAN DOCKER RESOURCE CLASS RAM
#   XLARGE  = 16384 MB TOTAL
#   LARGE   =  8192 MB TOTAL
#   MEDIUM+ =  6144 MB TOTAL
#   MEDIUM  =  4096 MB TOTAL
#
#   execute in cicd pipeline, such as prior to serverless deploy
#   
#      chmod +x $HOME/project/cicd_scripts/set_node_options.sh
#      source $HOME/project/cicd_scripts/set_node_options.sh "<< parameters.resource_class >>"
#
case $1 in
    xlarge)
        export NODE_OPTIONS=--max_old_space_size=16192
        ;;
    large)
        export NODE_OPTIONS=--max_old_space_size=8000
        ;;
    medium+)
        export NODE_OPTIONS=--max_old_space_size=5952
        ;;
    medium)
        export NODE_OPTIONS=--max_old_space_size=3904
        ;;
esac

echo "export NODE_OPTIONS=$NODE_OPTIONS" >> $BASH_ENV
