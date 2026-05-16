const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    content = content.replace(/src={([^}]+)}/g, (match, p1) => {
        if (p1.includes('||') || p1.includes('?') || p1 === 'undefined' || p1 === 'null' || p1.startsWith('`')) {
            return match;
        }
        // Exclude string literals
        if (p1.startsWith('"') || p1.startsWith("'")) {
            return match;
        }
        changed = true;
        return 'src={' + p1 + ' || undefined}';
    });
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
});
