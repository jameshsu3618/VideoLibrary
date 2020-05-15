
import React, { useState } from 'react'
const initialState = {term: 'Default text'}
const Searchbar = () => {
    const [searchParam, setSearchParam] = useState(initialState)
    function handleChange(e){
        setSearchParam({
            term: e.target.value
        })
    };

    return (
            <form onSubmit={this.handleSubmit(searchParam.term)}>
                <div>
                    <label>
                        Search here:
                    </label>
                    <input onChange={handleChange}>
                    </input>
                </div>
            </form>
    );
    
}
export default Searchbar