This is the document for the final project for SmartOSC internship term. 
# TOPIC: AMM

## Ý tưởng: 
Tương tự **UNISWAP**. Cho phép user add liquidity cho 1 cặp token ERC20(token chưa có trong Pool). Sau khi được add, user có thể connect wallet để swap 2 token trong cặp với nhau theo công thức x*y = k. 

### Smart Contract:
  1. ERC20 Contract: Quản lý các token ERC20.
  2. Swap Contract: \
    a. Quản lý việc thêm thanh khoản \
    b. Hoán đổi token theo công thức **x*y = k.**

### Backend (BE):
1. Lưu trữ lịch sử giao dịch
2. Lưu trữ thông tin giao dịch của người dùng \
    a. thêm thanh khoản \
    b. hoán đổi token.
### Frontend (FE):
  * Giao diện thêm thanh khoản: 
  Người dùng có thể thêm thanh khoản cho một cặp token ERC20.

  ----------
  * Giao diện swap: Cho phép người dùng hoán đổi hai token trong cặp với nhau.
  ----------

  * Giao diện lịch sử giao dịch: Hiển thị lịch sử giao dịch của người dùng.
  ----------
  * Giao diện? kết nối MetaMask: Kết nối ví của người dùng với MetaMask để thực hiện giao dịch.
  ------
  * Giao diện Live Chart: Hiển thị biểu đồ trực tiếp về tỷ giá hoán đổi hiện tại.
  * Tỷ giá hiện tại: Hiển thị tỷ giá hoán đổi hiện tại của cặp token.

## Tóm tắt luồng hoạt động:
1. Người dùng: Truy cập giao diện thêm thanh khoản và thêm thanh khoản cho một cặp token ERC20.
2. Người dùng: Truy cập giao diện swap để hoán đổi hai token trong cặp với nhau.
3. Smart Contract: Lưu trữ thanh khoản và cập nhật tỷ giá hoán đổi theo công thức x*y = k.
4. Frontend: Gửi giao dịch hoán đổi đến smart contract và cập nhật lịch sử giao dịch.
5. Frontend: Hiển thị lịch sử giao dịch, live chart và tỷ giá hoán đổi hiện tại.
6. Backend: Lưu trữ lịch sử giao dịch của người dùng.
