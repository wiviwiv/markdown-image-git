const fs = require('fs')
const path = require('path')

const api = require('./api')


function init(_options = {}) {
    const defaultOptions = {
        basePath: process.cwd(),
        doc: 'README.md',
        token: '',
        repos: '',
        branch: 'master',
        dir: '_images',
        message: 'form markdown-image-git'
    }
    const options = Object.assign({}, defaultOptions, _options)

    if (!options.repos) {
        console.error('仓库地址不能为空')
        process.exit(0)
    }
    if (!options.token) {
        console.error('github token 不能为空')
        process.exit(0)
    }
    process.env.GIT_TOKEN = options.token

    main(options)
}

// https://developer.github.com/v3/repos/contents/
function putFile(path, content, repos, branch = 'master', message = 'from-git-sync', ) {
    const url = `/repos/${repos}/contents/${path}`

    return api.put(url, {
        path,
        message,
        branch,
        content,
    })
}

async function main(options) {
    let {
        basePath,
        doc,
        token,
        repos,
        branch,
        dir,
        message
    } = options

    const docName = doc

    doc = path.resolve(basePath, doc)


    let content = fs.readFileSync(
        doc,
    ).toString()

    let images = content.match(/\!\[.*\]\(.*\)/g)

    if (!images || images.length === 0) {
        console.log(docName, ' 文件中未找到图片引用，无需同步。')
        return
    }

    const list = []

    for (const image of images) {
        // ![meta](url)
        const reg = image.match(/\((.*)\)/)
        let imagePath = reg && reg[1]
        let fileName = imagePath.split('/').pop()

        imagePath = path.resolve(basePath, imagePath)

        const response = await putFile(
            // file path
            `${dir}/${Math.random().toString(16).slice(3)}-${fileName}`,
            // content
            fs.readFileSync(imagePath).toString('base64'),
            repos,
            branch,
            message,
        )

        imageUrl = response.data.content.download_url

        console.log(image, ' ----> ', imageUrl, '  done')

        list.push({
            image,
            imageUrl
        })
    }

    list.forEach(({
        image,
        imageUrl
    }) => {
        const _image = image.replace(/\(.*\)/g, `(${imageUrl})`)
        content = content.replace(image, _image)
    })

    fs.createReadStream(doc).pipe(fs.createWriteStream(`${doc}.back`))

    fs.writeFileSync(doc, content)

    console.log('\n\n\ndone ! 你的文件已备份为 .back 文件')
}

module.exports = init