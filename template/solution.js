const placeholder = {
    use: true,
    value:``
}

function getInput(){
    if(placeholder.use){
        return placeholder.value;
    }
    return document.getElementsByTagName("iframe")[0].contentWindow.document.body.innerText;
}

function runCode(){

}

function runCode2(){
    
}



function buildData(input){
    var collection = {};
    
    lineArray = input.split("\n");
    for(const lineNum in lineArray){
        const line = lineArray[lineNum];
        if(line.length != "\n"){
            var data = line.split(" ");

            var Name = data[0];

            collection[Name] = new Object(Name);
        }
    }

    return collection;
}

function incrementArray(array, limit){
    
    var lastIndex = array.length - 1;

    array = incrementAtIndex(array, lastIndex, limit);

    return array;
}

function incrementAtIndex(array, index, limit){
    var value = array[index];
    value++;

    if(value > limit){ // handle overflow
        array = incrementAtIndex(array, index-1, limit);
        value = 0;
    }

    array[index] = value;

    return array;
}