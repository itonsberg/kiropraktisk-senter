"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
}

const reviews: Review[] = [
  {
    name: "Fornøyd Pasient",
    initials: "FP",
    rating: 5,
    text: "Veldig profesjonell behandling. Fikk hjelp med langvarige nakkesmerter som jeg hadde slitt med i flere år. Anbefales på det sterkeste!",
    date: "2024"
  },
  {
    name: "Kunde",
    initials: "K",
    rating: 5,
    text: "Fantastisk service og kompetanse. Kiropraktoren tok seg god tid til å forklare problemet og behandlingen. Merker allerede stor forbedring.",
    date: "2024"
  },
  {
    name: "Pasient",
    initials: "P",
    rating: 5,
    text: "Har gått her i flere år. Alltid like profesjonelle og hjelpsomme. Moderne utstyr og effektiv behandling.",
    date: "2024"
  },
  {
    name: "Fornøyd",
    initials: "F",
    rating: 5,
    text: "Beste kiropraktoren jeg har vært hos. Fikk meg raskt på beina igjen etter en skade. Varmt anbefalt!",
    date: "2024"
  },
  {
    name: "Kunde",
    initials: "K",
    rating: 5,
    text: "Topp behandling og hyggelig personale. Sentralt beliggende og lett å bestille time online.",
    date: "2024"
  },
  {
    name: "Pasient",
    initials: "P",
    rating: 5,
    text: "Meget fornøyd med behandlingen. God oppfølging og tydelige forklaringer underveis.",
    date: "2024"
  }
];

function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 5000);
  }, [api, current]);

  const backgroundImages = [
    '/images/treatment-back-1.jpg',
    '/images/treatment-neck-1.jpg',
    '/images/treatment-back-2.jpg',
    '/images/treatment-foot-1.jpg',
    '/images/treatment-neck-2.jpg',
    '/images/treatment-back-3.jpg',
  ];

  return (
    <div className="w-full py-12 lg:py-20 relative">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/treatment-back-1.jpg"
          alt="Treatment background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Hva våre pasienter sier
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Over 5000 fornøyde pasienter siden 1981
            </p>
          </div>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="relative rounded-2xl h-full overflow-hidden backdrop-blur transition-all min-h-[280px] group">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={backgroundImages[index % backgroundImages.length]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8 flex justify-between flex-col h-full">
                      <div className="flex flex-col gap-4">
                        {/* Star Rating */}
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#f48337] text-[#f48337]" />
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-white text-base leading-relaxed">
                          "{review.text}"
                        </p>
                      </div>

                      {/* Author */}
                      <div className="flex flex-row gap-3 items-center mt-6 pt-6 border-t border-white/20">
                        <Avatar className="h-10 w-10 bg-[#f48337] text-white">
                          <AvatarFallback className="bg-[#f48337] text-white font-semibold">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{review.name}</p>
                          <p className="text-sm text-white/70">{review.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { Testimonials };
