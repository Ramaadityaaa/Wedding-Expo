import React from 'react';

const ReviewPage = ({ vendorData }) => {
  const reviews = vendorData.reviews;

  return (
    <div>
      <h1>Ulasan Vendor</h1>
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <p>{review.userName}</p>
            <p>{review.comment}</p>
            {review.reply && <p>Balasan: {review.reply}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
