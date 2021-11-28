import React, {Component} from "react";
import axios from "axios";
import Joke from "./Joke";
import './Dadjokes.css'

class Dadjokes extends Component {
    static defaultProps = {
        numJokes: 10,
    }
    constructor(props){
        super(props)
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem('Jokes') || '[]'),
            isLoading: false
        };
        this.seenJokes = new Set (this.state.jokes.map(j => j.text))
        this.handleClick = this.handleClick.bind(this)
    }

    async getJokes(){
        try {
            
        
        let jokesArr = [];
        while( jokesArr.length < this.props.numJokes){
            const response = await axios.get('https://icanhazdadjoke.com/', {headers:{
            Accept: 'application/json'
        }})
        let {joke, id} = response.data
        if(!this.seenJokes.has(joke)){
            jokesArr.push({text: joke, id:id, vote: 0})
        }else {
            console.log('found dup')
        }
        }
        this.setState((st => ({
            isLoading: false,
            jokes : [...st.jokes, ...jokesArr]
        }))
         , () => (
             window.localStorage.setItem('Jokes', JSON.stringify(this.state.jokes))
         ) 
        )
        window.localStorage.setItem('Jokes', JSON.stringify(jokesArr))
    } catch (error) {
            alert(error)
    }
    }

    componentDidMount(){
       if(this.state.jokes.length === 0) this.getJokes();
    }

    handleVote(id, delta){
        this.setState(st => ({
            jokes: st.jokes.map(j => 
                j.id === id? {...j , vote: j.vote + delta} : j
            )
            }), () => (
                window.localStorage.setItem('Jokes', JSON.stringify(this.state.jokes))
            ))
    }
    handleClick(){
        this.setState({isLoading: true}, this.getJokes)
    }
    render(){
        const diplayJokes = this.state.jokes.sort((a,b) => b.vote - a.vote)
        if(this.state.isLoading){
            return(
                <div className='JokeList-spinner'>
                    <i className='far fa-8x fa-laugh fa-spin'/>
                    <h1 className='JokeList-title'>...Loading</h1>
                </div>
            )
        }
        return(
            <div className='JokeList'>
            <div className='JokeList-sidebar'>
            <h1 className='JokeList-title'>
                <span>Dad</span> Jokes
            </h1>
            <img alt='sidebar-img' src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
            <button className='JokeList-getmore' onClick={this.handleClick}>New Jokes</button>
            </div>
            <div className='JokeList-jokes'>
                {diplayJokes.map(j => (
           
           <div><Joke text = {j.text} key={j.id} id={j.id} votes={j.vote} upVote={() => this.handleVote(j.id, 1)}
           downVote={() => this.handleVote(j.id, -1)}/></div>
      
   ))}
            </div>
        </div>
        )
    }
}

export default Dadjokes