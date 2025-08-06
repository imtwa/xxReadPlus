const fs = require('fs');
const path = require('path');

// 配置项
const rootDir = path.join(__dirname, '..', 'static');
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
const largeImages = [];
const images = [];
const sizeThreshold = 500; // 大图片阈值，单位KB
const targetDir = path.join(__dirname, 'large-images');

// 命令行参数解析
const args = process.argv.slice(2);
const options = {
    structure: args.includes('--structure') || args.includes('-s'),
    size: args.includes('--size') || args.includes('-z'),
    duplicate: args.includes('--duplicate') || args.includes('-d'),
    large: args.includes('--large') || args.includes('-l'),
    copy: args.includes('--copy') || args.includes('-c'),
    all: args.length === 0 || args.includes('--all') || args.includes('-a'),
    help: args.includes('--help') || args.includes('-h')
};

// 显示帮助信息
function showHelp() {
    console.log('\n图片扫描工具 - 使用指南');
    console.log('=================================');
    console.log('可用参数:');
    console.log('  -s, --structure   按层级结构显示所有图片');
    console.log('  -z, --size        按大小排序显示所有图片');
    console.log('  -d, --duplicate   查找可能相同的图片');
    console.log('  -l, --large       查找大于500KB的图片');
    console.log('  -c, --copy        复制大图片到新文件夹');
    console.log('  -a, --all         执行所有功能(默认)');
    console.log('  -h, --help        显示帮助信息');
    console.log('\n示例:');
    console.log('  node image-scan.js -s -l    # 显示图片结构并找出大图片');
    console.log('  node image-scan.js -c       # 仅复制大图片到新文件夹');
    console.log('  node image-scan.js          # 执行所有功能\n');
}

// 确保目录存在
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 递归扫描目录
function scanDirectory(dir, level = 0, logStructure = false) {
    try {
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                // 如果需要显示结构，则输出目录名
                if (logStructure) {
                    console.log('  '.repeat(level) + '- ' + item + '/');
                }
                // 递归扫描子目录
                scanDirectory(itemPath, level + 1, logStructure);
            } else if (stats.isFile()) {
                // 检查是否为图片文件
                const ext = path.extname(item).toLowerCase();
                if (imageExtensions.includes(ext)) {
                    // 计算相对路径
                    const relativePath = path.relative(rootDir, itemPath);

                    // 如果需要显示结构，则输出文件名和大小
                    if (logStructure) {
                        console.log(
                            '  '.repeat(level) +
                                '- ' +
                                item +
                                ' (' +
                                formatFileSize(stats.size) +
                                ')'
                        );
                    }

                    // 存储图片信息
                    images.push({
                        path: itemPath,
                        relativePath: relativePath,
                        size: stats.size,
                        name: item
                    });

                    // 如果图片大于阈值，添加到大图片列表
                    if (stats.size > sizeThreshold * 1024) {
                        largeImages.push({
                            path: itemPath,
                            relativePath: relativePath,
                            size: stats.size,
                            name: item
                        });
                    }
                }
            }
        });
    } catch (error) {
        console.error(`扫描目录出错 ${dir}: ${error.message}`);
    }
}

// 功能1: 按层级结构显示所有图片
function displayImageStructure() {
    console.log('\n按层级结构显示所有图片:');
    console.log('=================================');
    console.log(`- static (根目录)`);
    scanDirectory(rootDir, 1, true);
    console.log('=================================');
    console.log(`总计: ${images.length} 个图片`);
}

// 功能2: 按大小排序显示所有图片
function displayImagesBySize() {
    console.log('\n按大小排序显示所有图片:');
    console.log('=================================');

    // 按大小升序排序
    const sortedImages = [...images].sort((a, b) => b.size - a.size);

    sortedImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.relativePath} (大小: ${formatFileSize(img.size)})`);
    });

    console.log('=================================');
    console.log(`总计: ${images.length} 个图片`);
}

// 功能3: 查找相同大小的图片
function findDuplicateImages() {
    console.log('\n查找可能相同的图片:');
    console.log('=================================');

    const sizeMap = {};

    // 按大小对图片进行分组
    images.forEach(img => {
        if (!sizeMap[img.size]) {
            sizeMap[img.size] = [];
        }
        sizeMap[img.size].push(img);
    });

    // 过滤出至少有两张相同大小的图片组
    const duplicateGroups = Object.values(sizeMap).filter(group => group.length >= 2);

    if (duplicateGroups.length === 0) {
        console.log('没有找到相同大小的图片。');
    } else {
        duplicateGroups.forEach((group, groupIndex) => {
            console.log(`\n[组 ${groupIndex + 1}] 大小: ${formatFileSize(group[0].size)}`);
            group.forEach((img, imgIndex) => {
                console.log(`  ${imgIndex + 1}. ${img.relativePath}`);
            });
        });

        console.log('=================================');
        console.log(`总共找到 ${duplicateGroups.length} 组相同大小的图片`);
    }
}

// 功能4: 查找大图片
function findLargeImages() {
    console.log(`\n查找大于${sizeThreshold}KB的图片:`);
    console.log('=================================');

    // 按大小升序排序
    largeImages.sort((a, b) => b.size - a.size);

    if (largeImages.length === 0) {
        console.log(`没有找到大于${sizeThreshold}KB的图片。`);
    } else {
        largeImages.forEach((img, index) => {
            console.log(`${index + 1}. ${img.relativePath} (大小: ${formatFileSize(img.size)})`);
        });

        // 计算总大小
        const totalSize = largeImages.reduce((sum, img) => sum + img.size, 0);

        console.log('=================================');
        console.log(`总计: ${largeImages.length} 个超过${sizeThreshold}KB的图片`);
        console.log(`总大小: ${formatFileSize(totalSize)}`);
    }
}

// 功能5: 复制大图片
function copyLargeImages() {
    if (largeImages.length === 0) {
        console.log(`\n没有找到大于${sizeThreshold}KB的图片，无需复制。`);
        return;
    }

    console.log(`\n开始复制大图片到 ${targetDir}...`);
    console.log('=================================');

    // 确保目标根目录存在
    ensureDirectoryExists(targetDir);

    let copyCount = 0;

    largeImages.forEach(img => {
        // 构建目标文件路径
        const targetPath = path.join(targetDir, img.relativePath);
        // 确保目标文件所在的目录存在
        ensureDirectoryExists(path.dirname(targetPath));

        try {
            // 复制文件
            fs.copyFileSync(img.path, targetPath);
            copyCount++;
            console.log(`✓ 已复制: ${img.relativePath}`);
        } catch (error) {
            console.error(`✗ 复制失败: ${img.relativePath} - ${error.message}`);
        }
    });

    console.log('=================================');
    console.log(`复制完成! 共复制了 ${copyCount} 个文件到 ${targetDir}`);
}

// 主函数
function main() {
    // 如果请求帮助，显示帮助信息并退出
    if (options.help) {
        showHelp();
        return;
    }

    console.log(`开始扫描 static 目录下的图片...\n`);

    try {
        if (fs.existsSync(rootDir)) {
            // 首先扫描目录，收集所有图片信息
            scanDirectory(rootDir);

            // 根据命令行参数执行相应功能
            if (options.structure || options.all) {
                displayImageStructure();
            }

            if (options.size || options.all) {
                displayImagesBySize();
            }

            if (options.duplicate || options.all) {
                findDuplicateImages();
            }

            if (options.large || options.all) {
                findLargeImages();
            }

            if (options.copy || options.all) {
                copyLargeImages();
            }
        } else {
            console.error(`目录不存在: ${rootDir}`);
            console.log('请确保脚本路径配置正确。');
        }
    } catch (error) {
        console.error(`错误: ${error.message}`);
    }
}

// 执行主函数
main();
