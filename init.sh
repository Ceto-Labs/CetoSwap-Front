#!/bin/bash

# 启动私链
dfx start --background
# 停止命令
#dfx stop

dfx  canister --network ic create www

# fritst deploy
dfx  deploy --network=ic www

# www install or upgrade
dfx build --network=ic www

dfx  canister --network=ic install www --mode=upgrade
dfx  canister --network=ic install www --mode=reinstall

# 查看罐子状态
dfx  canister --network=ic status www

# stop
dfx  canister --network=ic stop www
dfx  canister --network=ic start www