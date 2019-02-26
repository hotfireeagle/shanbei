#!/bin/bash

set -e

source ~/.bashrc

# echo "删除node_modules，全部重新安装"
# rm -rf ./node_modules  

npm install

echo "编译打包文件清理"
npm run clean

npm run build

git_status=`git status`

git status

# 判断时候有需要提交的文件的文件
if [[ "$git_status" == *"nothing to commit, working directory clean"* ]]
    then
        echo "没有可提交的内容"
    else
        git add ./assets
        git add ./html
        
        git commit -m "englishLearn auto commit build_files";

        git push
fi
