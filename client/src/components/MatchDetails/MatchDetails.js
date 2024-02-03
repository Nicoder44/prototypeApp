import { useMatchContext } from '../../hooks/useMatchContext'
import { useAuthContext } from '../../hooks/useAuthContext'


const MatchDetails = ({ match }) => {
  const { dispatch } = useMatchContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }
  }

  return (
    <div className="match-details">
      <h4>{match.prenom} {match.nom}</h4>
      <p><strong>Load (kg): </strong>{match.prenom}</p>
      <p><strong>Reps: </strong>{match.prenoom}</p>
    </div>
  )
}

export default MatchDetails