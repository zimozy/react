import React from 'react';
import ReactDOM from 'react-dom';
import axios from '../node_modules/axios';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

console.clear();

const TodoForm = ({ addTodo }) => {
    // Input Tracker
    let input;
    // Return JSX
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            addTodo(input.value);
            input.value = '';
        }}>
        <input className="form-control col-md-12" ref={node => {
                input = node;
            }} />
            <br />
        </form>
    );
};

const Todo = ({ todo, remove }) => {
    // Each Todo
    return (<a href="#" className="list-group-item" onClick={() => { remove(todo.id) }}>
        {todo.text}</a>);
}

const TodoList = ({ todos, remove }) => {
    // Map through the todos
    const todoNode = todos.map((todo) => {
        return (<Todo todo={todo} key={todo.id} remove={remove} />)
    });
    return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}




const Title = ({todoCount}) => {
    return (
        <div>
            <div>
                <h1>to-do ({todoCount})</h1>
            </div>
        </div>
    );
}









// Contaner Component (Ignore for now)
class TodoApp extends React.Component {
    constructor(props) {
        // Pass props to parent class
        super(props);
        // Set initial state
        this.state = {
            data: []
        }
        this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos'

    }

    // Add todo handler
    addTodo(val) {
        // Assemble data
        const todo = {text: val}
        // Update data
        axios.post(this.apiUrl, todo)
            .then((res) => {
                this.state.data.push(res.data);
                this.setState({data: this.state.data});
            })
    }
    // Handle remove
    handleRemove(id) {
        // Filter all todos except the one to be removed
        const remainder = this.state.data.filter((todo) => {
            if (todo.id !== id) return todo;
        });
        
        axios.delete(this.apiUrl + '/' + id)
            .then((res) => {
                this.setState({data: remainder})
            })
    }


    render() {
        return (
            <div className="container">
                <Title todoCount={this.state.data.length}/>
                <TodoForm addTodo={this.addTodo.bind(this)} />
                <TodoList
                    todos={this.state.data}
                    remove={this.handleRemove.bind(this)} />
            </div>
        );
    }

    componentDidMount() {
        axios.get(this.apiUrl)
            .then((res) => {
                this.setState({data:res.data})
            })
    }
}
ReactDOM.render(<TodoApp />, document.getElementById('root'));