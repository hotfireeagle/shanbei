#!/bin/bash

output=$(git diff HEAD --name-only --cached);
if [[ "$output" =~ "assets/static" ]] || [[ "$output" =~ "assets/webpack-assets" ]] || [[ "$output" =~ "html/" ]]
    then
    echo "请不要提交打包后的文件";
    exit 1
fi