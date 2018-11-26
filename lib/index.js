/**
--max-speed=x , -s x         最高速度x
--num-connections=x , -n x   连接数x
--output=f , -o f            下载为本地文件f
--search[=x] , -S [x]        搜索镜像
--header=x , -H x            添加头文件字符串x（指定 HTTP header）
--user-agent=x , -U x        设置用户代理（指定 HTTP user agent）
--no-proxy ， -N             不使用代理服务器
--quiet ， -q                静默模式
--verbose ，-v               更多状态信息
--alternate ， -a            Alternate progress indicator
--help ，-h                  帮助
--version ，-V               版本信息

more for English

--max-speed=x           -s x    Specify maximum speed (bytes per second)
--num-connections=x     -n x    Specify maximum number of connections
--max-redirect=x                Specify maximum number of redirections
--output=f              -o f    Specify local output file
--search[=n]            -S[n]   Search for mirrors and download from n servers
--ipv4                  -4      Use the IPv4 protocol
--ipv6                  -6      Use the IPv6 protocol
--header=x              -H x    Add HTTP header string
--user-agent=x          -U x    Set user agent
--no-proxy              -N      Just don't use any proxy server
--insecure              -k      Don't verify the SSL certificate
--no-clobber            -c      Skip download if file already exists
--quiet                 -q      Leave stdout alone
--verbose               -v      More status information
--alternate             -a      Alternate progress indicator
--help                  -h      This information
--timeout=x             -T x    Set I/O and connection timeout
--version               -V      Version information
 */

const {
    spawn
} = require('child_process')
const path = require('path')
class Axel {
    constructor() {}
    async checkInstall() {
        return new Promise((resolve, reject) => {
            const ch = spawn('which', ['axel'])
            ch.stdout.on('data', data => {
                const res = data.toString()
                if (res.indexOf('not found') === -1) {
                    resolve(true)
                }
                resolve(false)
            })
        }).catch(error => {
            console.log(`check axel install error: ${error}`)
            return false
        })
    }
    /**
     * get options
     *
     * @param {*} options
     * @returns
     * @memberof Axel
     */
    async genOptions(options, args) {
        if (!options) {
            return []
        }
        const keys = Object.keys(options)
        const result = [];
        for (const key of keys) {
            const res = await this.matchOption(key, options)
            if (res) {
                result.push(res.toString())
            }
        }
        for (const url of args) {
            result.push(url.toString())
        }
        return result;
    }

    /**
     * match option
     *
     * @param {*} key
     * @param {*} options
     * @returns
     * @memberof Axel
     */
    async matchOption(key, options) {
        if (['s', 'n', 'o', 'S', 'H', 'U', 'T'].includes(key)) {
            return `-${key} ${options[key]}`
        } else if (['4', '6', 'N', 'k', 'c', 'q', 'a'].includes(key)) {
            return `-${key}`
        } else if (key == 'max-redirect') {
            return `max-redirect=${options[key]}`
        }
        return false
    }
    /**
     * download
     *
     * @param {string} [axelOptions={
     *         s: x ,//Specify maximum speed (bytes per second)
     *         n: x ,//Specify maximum number of connections
     *         max-redirect x,//Specify maximum number of redirections
     *         o: f,//Specify local output file
     *         S:[n],//Search for mirrors and download from n servers
     *         4:true,//Use the IPv4 protocol
     *         6:false,//Use the IPv6 protocol
     *         H: x ,//Add HTTP header string
     *         U: x ,//Set user agent
     *         N:true,//Just don't use any proxy server
     *         k:true,//Don't verify the SSL certificate
     *         c:true,//Skip download if file already exists
     *         q: true,//Leave stdout alone
     *         a: true,//Alternate progress indicator
     *         T: '',//Set I/O and connection timeout
     *     }]
     * @param {*} spawnOptions
     * @param {*} urls
     * @returns
     * @memberof Axel
     */
    async download(axelOptions = {}, spawnOptions = {}, ...urls) {
        const check = await this.checkInstall()
        if (!check) {
            console.log('axel is not install!')
            return false
        }
        const _options = await this.genOptions(axelOptions, urls)
        return new Promise((resolve, reject) => {
            const axel = spawn('axel', _options, spawnOptions)
            axel.stdout.on('data', data => {
                console.log(`${data.toString()}`)
            })
            axel.stderr.on('data', data => {
                console.log(`错误：${data.toString()}`)
                reject(false)
            })
            axel.on('close', code => {
                console.log(`子进程退出码：${code}`)
            })
            resolve(true)
        }).catch(error => {
            console.trace(error)
            return false
        })
    }
}

module.exports = Axel