const setPosition = () => {
  let value = Number(window.prompt(`Insira um ponto de origem e destino (maior que 0 e menor que ${graph.length + 1})`));

  if(value > graph.length || value < 1) {
    window.alert(`Insira um ponto de origem e destino, maior que 0 e menor que ${graph.length + 1}`);
    value = setPosition();
  }

  return value;
}

const getNextPath = (origin) => {
  let value = 0;
  let destination = -1;

  for(let i = 0; i < graph.length; i++) {
    if(graph[origin][i] > -1) {
      if(destination === -1 && !direction_arr.includes(i)) {
        value = graph[origin][i];
        destination = i;
      }

      if(direction_arr.includes(i)) {
        continue;
      }

      if(value > graph[origin][i]) {
        value = graph[origin][i];
        destination = i;
      }
    }
  }
  

  return destination;
}

const getDestination = (origin) => {
  return getNextPath(origin);
}

const setDirectionValue = (value, position) =>  {
  direction_arr[position] = value;
}

const getPathValue = (aux) => {
  let value = 0;
  let negative_node = direction_arr.indexOf(-1);
  let arr_length = direction_arr.length;
  let loop_length = negative_node !== -1 ? negative_node: arr_length - 1;

  for(let i = 0; i < loop_length; i++) {
    if(i === loop_length - 1) {
      value += graph[aux[i]][aux[arr_length - 1]];
    } else {
      value += graph[aux[i]][aux[i + 1]]; 
    }
  }

  return value;
}

const setBestPath = () => {
  let last_aux = [...direction_arr];
  let new_aux = [...direction_arr];
  let last_value = getPathValue(last_aux);
  let new_value = 0;
  let negative_node = direction_arr.indexOf(-1);
  let length = negative_node !== -1 ? negative_node - 1 : direction_arr.length - 2;
  let position = -1;
  
  for(let i = length; i > 0; i--) {

    if(i === 1) continue;

    position = new_aux[i];
    new_aux[i] = last_aux[i - 1];
    new_aux[i - 1] = position;
    new_value = getPathValue(new_aux);

    if(new_value < last_value) {
      last_aux = [...new_aux];
      last_value = new_value;
    }
  }

  direction_arr = [...last_aux];
  return last_value;
}

const getBestPosition = () => {
  let counter = 0;
  let destination = -1;
  let origin = direction_arr[0];
  let value = 0;
  
  do {
    let negative_node = direction_arr.includes(-1);

    if(counter === 0) {
      destination = getDestination(origin);  
      setDirectionValue(destination, counter + 1);
      printResult("Menor Caminho");
      origin = destination;

    } else {
      if(counter != direction_arr.length - 2) {
        destination = getDestination(origin);
        setDirectionValue(destination, counter + 1);
        
        printResult("Menor Caminho");
        origin = direction_arr[negative_node - 1];
        value = setBestPath();
      }
    }

    counter++;

  } while(counter < direction_arr.length - 2);

  return value;
}

const setInitialPositions = (position, path_size) => {
  direction_arr[0] = position;
  direction_arr[path_size - 1] = position;
}

const printResult = (message) => {
  let result = "";
  direction_arr.map((value, i) => {
    i !== 15 ? result += `${value + 1} -> `:  result += `${value + 1}`;
  })

  console.log(`${message}: ${result}`);
}

const graph = [
[-1, 1.50, 1.40, 1.30, 4.30, 5.50, 4.90, 6.20, 6.40, 6.90, 7.20, 8.80, 11.60, 8.50, 5.90],
[1.90, -1, 0.05, 1.10, 3.10, 4.30, 3.70, 5.20, 5.40, 4.60, 5.80, 7.80, 10.50, 7.80, 4.90],
[1.80, 0.07, -1, 0.04, 3.20, 4.40, 3.80, 5.40, 4.70, 4.40, 5.50, 7.70, 10.70, 7.20, 5.10],
[2.30, 0.90, 0.60, -1, 3.20, 4.60, 3.80, 5.00, 4.70, 4.30, 5.50, 7.60, 10.50, 7.20, 4.90],
[4.00, 2.80, 2.80, 3.30, -1, 2.20, 1.60, 5.80, 6.40, 6.20, 6.80, 8.00, 9.80, 8.70, 3.80],
[5.40, 4.20, 4.20, 4.70, 1.80, -1, 2.50, 8.60, 8.30, 7.50, 7.60, 8.90, 10.70, 9.60, 5.40],
[6.70, 5.30, 5.30, 5.80, 2.40, 2.40, -1, 10.30, 7.40, 9.10, 7.50, 9.30, 10.70, 10.00, 6.20],
[5.20, 3.10, 3.00, 3.50, 3.70, 4.90, 4.30, -1, 3.30, 3.30, 3.60, 5.10, 7.80, 5.80, 1.80],
[5.80, 5.10, 4.60, 4.80, 6.60, 7.70, 7.20, 3.20, -1, 1.50, 2.40, 4.80, 7.50, 3.20, 2.90],
[6.50, 5.70, 5.20, 5.50, 6.20, 7.40, 6.80, 2.50, 2.90, -1, 1.20, 3.30, 6.00, 2.80, 2.00],
[7.10, 6.40, 5.90, 6.10, 7.40, 8.40, 7.80, 3.90, 2.90, 2.10, -1, 2.60, 5.30, 1.90, 2.80],
[9.40, 8.30, 8.10, 8.80, 7.60, 7.50, 7.00, 6.00, 6.80, 5.80, 3.70, -1, 3.40, 4.40, 4.00],
[12.20, 10.10, 9.90, 10.60, 9.60, 9.50, 8.90, 9.00, 8.80, 7.80, 7.10, 5.40, -1, 7.50, 6.10],
[8.80, 8.10, 7.60, 7.80, 9.20, 9.10, 8.50, 5.60, 4.30, 3.80, 2.70, 3.20, 6.00, -1, 4.70],
[6.10, 5.00, 4.80, 5.50, 3.80, 4.70, 4.10, 3.00, 4.60, 3.60, 2.80, 5.30, 6.00, 4.50 -1]
];

//The value will be shown in the console

const path_size = 16;
const position = setPosition() - 1;
let direction_arr = Array(path_size).fill(-1);
setInitialPositions(position, path_size);
const value = getBestPosition().toFixed(2);
console.log("-------------------------------------- Resultado --------------------------------------");
printResult("Valor Final");
console.log(`Valor do Menor Caminho: ${value}`);