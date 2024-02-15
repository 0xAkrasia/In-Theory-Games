import twoThirdsGameTitle from '../../images/game_title.png'

export const Navigation = () => {
  return (
    <div className="w-layout-hflex title-block">
      <div className="stripes" />
        <img src={twoThirdsGameTitle} loading="lazy" width={231} alt="" className="game-title" />
      <div className="stripes right" />
    </div>
  );
};