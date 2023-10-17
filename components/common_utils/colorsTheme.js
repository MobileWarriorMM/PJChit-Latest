const getLink= (string) => {

    var finalColor = 'https://infinitbility.com/'

    if(string=="gold"){
        finalColor="gold color theme";
    }

    if(string=="red"){
        finalColor="red color theme";
    }

    
    return {"color":finalColor,"code":'#000000'};
}

export default getLink