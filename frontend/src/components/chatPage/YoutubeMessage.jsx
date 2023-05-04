export const YoutubeMessage = (item) => {
    
    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video

    return (
        <iframe 
            width="280" 
            height="160" 
            style={{'maxWidth': "90%"}}
            src={`https://www.youtube.com/embed/`+ (item.text.match(regYoutube)[1])}
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen> 
            
        </iframe>
    )
}