import React from 'react';
import { useCandidates } from '../context/CandidatesContext';

const Results = () => {
  const { results, loading, fetchResults } = useCandidates();

  React.useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#4bc0c0', '#ff9f40'];
  const chartData = results.map((result, index) => ({
    candidate: result.name,
    party: result.party,
    votes: result.votes,
    color: colors[index % colors.length]
  }));

  const totalVotes = chartData.reduce((sum, result) => sum + result.votes, 0);
  const maxVotes = chartData.length > 0 ? Math.max(...chartData.map(r => r.votes)) : 1;

  if (loading) {
    return <div className="results-container"><div className="container-content"><h2>Loading...</h2></div></div>;
  }

  return (
    <div className="results-container">
      <div className="container-content">
        <h2>Election Results</h2>
      <div className="chart-container">
        {chartData.map((result, index) => (
          <div key={index} className="chart-bar">
            <div className="bar-label">{result.candidate} ({result.party})</div>
            <div className="bar" style={{
              width: `${(result.votes / maxVotes) * 100}%`,
              backgroundColor: result.color
            }}>
              <span className="bar-value">{result.votes} votes ({totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0}%)</span>
            </div>
          </div>
        ))}
      </div>
      <div className="total-votes">Total Votes: {totalVotes}</div>
      </div>
    </div>
  );
};

export default Results;