"use client";
import Star from "../../../public/assets/images/testimonialStar.svg";
import Image from 'next/image';
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import { Card } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const UserReviews = ({ userReviews }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {userReviews &&
        userReviews.map((review) => (
          <Card
            key={review.id}
            className="flex flex-col gap-2 p-4 rounded-xl shadow-lg bg-white border border-gray-100 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-1">
              <Avatar className="w-12 h-12 border-2 border-yellow-400 shadow-md">
                <AvatarImage
                  src={review.reviewerImage && review.reviewerImage?.startsWith('https') ? review.reviewerImage : defaultMedia.src}
                  alt={review.reviewerName}
                />
                <AvatarFallback>{review.reviewerName ? review.reviewerName[0] : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 right-box">
              <p className="font-medium text-gray-800 text-base mb-0">{review.reviewerName}</p>
              <div className="flex flex-row flex-nowrap gap-1">
              {Array(review.stars)
                .fill()
                .map((_, i) => (
                  <Star width={15} height={15} alt="star" key={i} className="text-yellow-400" />
                ))}
            </div>
            </div>
            </div>
            <p className="font-semibold text-lg text-gray-900">{review.title}</p>
            <p className="text-gray-600 text-sm mt-1">{review.description}</p>
          </Card>
        ))}
    </div>
  );
};

export default UserReviews;
