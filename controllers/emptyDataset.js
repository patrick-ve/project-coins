const fs = require('fs')

exports.emptyData = () => {
  // Read existing dataset from filesystem
  fs.readFile('./data/dataset.json', 'utf-8', (err, data) => {
    if (err) throw err

    // Parse JSON and set coins property to an empty array
    const file = JSON.parse(data)
    file.coins = []

    // Write new file into filesystem
    fs.writeFile('./data/dataset.json', JSON.stringify(file), 'utf-8', (err) => {
      if (err) throw err
    })
  });
}
