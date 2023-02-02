# Entropy Bridge Project!!
## 배포 순서
  1. Validator.sol 배포 (모든 체인에 배포)
  2. Validator.sol 에 검증인 추가 (모든 체인에 적용)
  3. TokenMinter의 경우 WErc20.sol 배포
  4. 각 유형의 Bridge배포
   
## 유형
 * coin <-> token === NativeBridge <-> TokenMintBridge
 * token (orgin) <->  token (wrap) === TokenVaultBridge <-> TokenMintBridge



## eth entropy WERC20 verify

npx hardhat verify --contract  contracts/erc20/EntropyErc20.sol:EntropyErc20 0x675ABaBD3A210566A5e213547523b740Be80041A "0xC779FA98fB4Ad9566eed0Fc7fc6Ecd82a08C4D46"  --network eth
