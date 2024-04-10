"use client"
import { get } from "http";
import { useEffect, useRef, useState } from "react";

function rearrange(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array
}

function getPokemon(index) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
        .then(response => response.json())
        .then(pokemon => {
            return pokemon
        })
}

function genboard(rows, cols) {
    if (rows < 1) rows = 1
    if (rows > 40) rows = 40
    if (cols < 1) cols = 1
    if (cols > 40) cols = 40

    let used_indexes = []
    let pokemon_limit = 1000
    let line = Array.from({length: rows * cols / 2}, () => {
        let index = Math.ceil(Math.random() * pokemon_limit)
        while (index in used_indexes) {
            index = Math.ceil(Math.random() * pokemon_limit)
        }
        return getPokemon(index)
    })

    line = rearrange([...line, ...line])

    let board = Array.from({length: cols}, (_, col) => {
        return Array.from({length: rows}, (_, row) => {
            return line[col * rows + row]
        })
    })

    return board
}

function aboveLimit(array, limit) {
    let trueRate = 0
    array.map((item, i) => {
        if (item) trueRate++ 
    })

    return trueRate > limit
}


export default function Page() {
    const [bx, setBx] = useState(6) 
    const [by, setBy] = useState(4) 

    const [board, setBoard] = useState(null)
    function getBoard(index) {
        return board[Math.floor(index / bx)][index % bx]
    }
    function autoSetIndex(index, value, arr) { // calulates index for u
        arr[Math.floor(index / bx)][index % bx] = value
        return arr
    }

    const [selected, setSelected] = useState(Array.from({length: bx * by}, (_, i) => [i, false]))

    const [gamestate, setGamestate] = useState({
        playerCount: 2,
        displayTime: 1200, // in ms
        players : [
            {
                name : "Player 1",
                score : 0
            },
            {
                name : "Player 2",
                score : 0
            },
        ],
        turn: 0,
    })
    

    useEffect(() => {
        setBoard(genboard(bx, by))
    }, [bx, by])

    
    useEffect(() => {
        if (aboveLimit(selected.map(item => item[1]), 1)) {
            const targets = selected.filter(item => item[1]).map(item => item[0])
            Promise.all(targets.map(item => getBoard(item)))
                .then(pokemons => {
                    const first_choice = pokemons[0]
                    const second_choice = pokemons[1]
                    
                    if (first_choice.name === second_choice.name) {
                        setTimeout(() => {
                            setBoard(prev => {
                                prev = autoSetIndex(targets[0], null, prev)
                                prev = autoSetIndex(targets[1], null, prev)
                                return prev
                            })
                            setSelected(Array.from({length: bx * by}, (_, i) => [i, false]))
                        }, gamestate.displayTime)
                    } 
                    
                    else {
                        setTimeout(() => setSelected(Array.from({length: bx * by}, (_, i) => [i, false])), gamestate.displayTime)
                    }
                })
        } 
    }, [selected])

    return (
        <main className="relative w-screen h-screen overflow-auto bg-zinc-900 text-white flex flex-col items-center justify-center gap-1">
            <div className="absolute top-3 left-16 flex flex-col gap-5 py-3 text-2xl">
                <span className="font-bold"> Board Size </span>
                <div className="self-center">
                    <input className="bg-transparent w-8 text-center outline-none" type="number" value={bx} onChange={event => setBx(event.target.value as any)}/>
                    <span className="font-thin italic"> : </span>
                    <input className="bg-transparent w-8 text-center outline-none" type="number" value={by} onChange={event => setBy(event.target.value as any)}/>
                </div>
            
                <span className="absolute w-[2px] h-2/4 top-0 bottom-5 m-auto -left-3 -rotate-45 bg-cyan-400"/>
                <span className="absolute w-[2px] h-2/4 top-0 bottom-5 m-auto -right-3 rotate-45 bg-cyan-400"/>
                <span className="absolute w-full h-[2px] top-0 bottom-0 m-auto left-0 bg-cyan-400"/>
            </div>

            <div className="absolute top-3 right-10 flex flex-col items-end gap-5 py-3 text-2xl">
                <span className="font-bold"> Player Count </span>
                <input className="bg-transparent w-12 outline-none pl-5" type="number" value={gamestate.playerCount} onChange={event => setGamestate(prev => {return {...prev, playerCount: event.target.value as any}})}/>
            
                <span className="absolute w-[2px] h-3/4 top-0 bottom-0 m-auto -right-3 bg-cyan-400"/>
                <span className="absolute w-[69%] h-[2px] top-0 bottom-0 m-auto -right-3 bg-cyan-400"/>
            </div>

            <div className="absolute bottom-0 right-0 w-1/5 h-4/5 flex flex-col items-center gap-10">
                {gamestate &&
                    gamestate.players.map((player, i) => {
                        return (
                            <div className="border-2 border-zinc-500 rounded-xl w-2/3 h-20 flex flex-col items-center justify-around"
                                key={i}
                            >
                                <input className="outline-none bg-transparent text-center font-semibold text-xl italic border-y-2 py-[1px] overflow-visible border-white/80 w-2/3 caret-transparent" type="text" placeholder="name" />
                                <span> Score: {player.score} </span>
                            </div>
                        )
                    })
                }
            </div>
            
            {board && 
                board.map((line, i) => {
                    return (
                        <div key={i} className="w-fit flex gap-1">
                            {line.map((pokemon_promise, j) => {
                                return (
                                    <Box key={j} 
                                        pokemon_promise={pokemon_promise} 
                                        size={window.innerWidth > window.innerHeight ? (window.innerHeight - 100) / (bx > by ? bx : by) : (window.innerWidth - 100) / (bx > by ? bx : by)} 
                                        selected={selected}
                                        setSelected={setSelected}
                                        index={i * bx + j}
                                    />                                        
                                )
                            })}
                        </div>
                    )
                })
            }
        </main>
    );
}

function Box({pokemon_promise, size, selected, setSelected, index}) {
    const [display, setDisplay] = useState(true)
    const [sprite, setSprite] = useState(null)

    useEffect(() => {
        if (pokemon_promise) {
            pokemon_promise.then(pokemon => {
                setSprite(pokemon.sprites.front_default)
            })
        } 
        else if (pokemon_promise === null) {
            setDisplay(false)
        }
    }, [pokemon_promise])

    return (
        <>
        {display ? 
            <div className="border-2 flex items-center justify-center text-2xl font-extrabold tracking-widest hover:border-white"
                style={{width: `${size}px`, height: `${size}px`, background : selected[index][1] ? "transparent" : "#fff", borderColor: `#eee`}}
                onClick={() => setSelected(prev => {
                    if (!aboveLimit(selected.map(item => item[1]), 2)) {
                        let temp = [...prev]
                        temp[index][1] = true
                        return temp
                    }
                    return prev
                })}
            >
                {selected[index][1] && <img className="w-full h-full" src={sprite} alt="pokemon" />}
            </div>
        :
            <div style={{width: `${size}px`, height: `${size}px`}}>
                
            </div>
        }
        </>
    )
}