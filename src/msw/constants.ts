/** 部分接口msw拦截的前缀地址 -> 自定义 */
export const MOCK_DOMAIN_PREFIX = 'https://demo.mock.com'

/** 指定某个接口返回mock数据的标识 */
export const API_PROXY_SUFFIX = '__mock'

/** 接口命名空间，通常如 api, 用来 开发环境/ngnix 配置代理的判断标识 */
export const API_NAME_SPACE = 'v1'

/** 钱包地址正则 -> mock钱包地址 */
export const WALLET_ADDRESS_REG = /^0x[0-9a-f]{40}/

/** 交易地址正则 -> mock交易地址 */
export const WALLET_TRANSFER_REG = /^0x[0-9a-f]{66}/
