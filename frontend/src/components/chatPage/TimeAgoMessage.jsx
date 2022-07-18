import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/fr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'



export const TimeAgoMessage = () => {
    
    const formatter = buildFormatter(frenchStrings)

return (
    <TimeAgo date='Feb 1, 1966' formatter={formatter} />
    )
}