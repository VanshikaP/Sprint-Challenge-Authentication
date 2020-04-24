let test_count = Math.floor(Math.random() * 100);

function incrementTestCount(num = 0) {
    return test_count+= num;
}

const testdata = {
    password: '123'
}

module.exports = {test_count, incrementTestCount, testdata}