

const getTodos = async () => {

    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    return await response.json();
    
};

export default getTodos;