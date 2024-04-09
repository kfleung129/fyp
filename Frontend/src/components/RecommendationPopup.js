import { ImCross } from "react-icons/im";

export default function RecommendationPopup(props) {
    // const { show, setPopup, movement, prevScore, currentScore, predictedPrice } = props;
    const { showPopup, setShowPopup, recommendationObject } = props;

    return (
        <div style={{
            position: 'absolute',
            width: '40vw',
            height: '40vh',
            background: '#171717',
            justifySelf: 'center',
            zIndex: 1000,
            left: 500,
            top: 200,
            borderRadius: '24px',
            display: showPopup ? 'block' : 'none',
            transition: '1s ease-in'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1em 2em' }}>
                <div style={{cursor: 'pointer'}}  onClick={() => setShowPopup(false)}>
                    <ImCross />
                </div>
                <h2 style={{ marginLeft: '6em' }}>Next trading day recommendation</h2>
            </div>
            <div style={{ padding: '1em 2em', fontSize: '1.2em' }}>
                <p style={{ marginTop: '1em' }}><span style={{ color: 'gray' }}>Today score: </span>{recommendationObject?.todayScore}</p>
                <p style={{ marginTop: '1em' }}><span style={{ color: 'gray' }}>Yesterday score: </span>{recommendationObject?.yesterdayScore}</p>
                <p style={{ marginTop: '1em' }}><span style={{ color: 'gray' }}>Score difference: </span>{recommendationObject?.scoreDiff}</p>
                <p style={{ marginTop: '1em' }}><span style={{ color: 'gray' }}>Movement: </span>{recommendationObject?.movement}</p>
                <p style={{ marginTop: '1em' }}><span style={{ color: 'gray' }}>Predicted stock price: </span>{recommendationObject?.predictedStockPrice}</p>
            </div>
        </div>
    )
  }