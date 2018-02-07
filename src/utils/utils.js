function getMax(arr) {
    arr.reduce(function(a, b) {
        return Math.max(a, b);
    });
}

function getMin(arr) {
    arr.reduce(function(a, b) {
        return Math.min(a, b);
    })
}

function groupyBy(arr, numberOfBlocks) {
    let chuncks = arr.chunk(numberOfBlocks);
    for(i = 0; i < chuncks.length(); i++) {
        for(j = 0; j < chunks[i].length; j++) {
            // TODO: Get OHLC from group
        }
    }
}

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var array=this;
        return [].concat.apply([],
            array.map(function(elem,i) {
                return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
            })
        );
    }
});