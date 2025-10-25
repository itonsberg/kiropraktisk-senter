"use client"

import React from "react"
import { motion } from "motion/react"
import { articles } from "@/lib/articles-data"

const ArticleColumn = (props: {
  className?: string
  articles: typeof articles
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.articles.map((article, i) => (
                <a
                  key={i}
                  href={`/forskning/${article.slug}`}
                  className="group block"
                >
                  <div className="p-8 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-white dark:bg-[#111111] hover:ring-2 hover:ring-[#f48337] transition-all">
                    <div className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      {article.excerpt}
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                      <img
                        width={40}
                        height={40}
                        src="/media/team/heidi-haavik.jpg"
                        alt={article.author}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="font-medium tracking-tight leading-5 group-hover:text-[#f48337] transition-colors">
                          {article.title}
                        </div>
                        <div className="leading-5 opacity-60 tracking-tight text-xs">
                          {article.author} • {article.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}

export function ArticlesPreview() {
  const firstColumn = articles.slice(0, 2)
  const secondColumn = articles.slice(0, 2)
  const thirdColumn = articles.slice(0, 2)

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f48337]/10 text-[#f48337] text-sm font-medium mb-4">
            Forskning
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Forskningsbaserte Artikler
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Utforsk nevrovitenskapen bak kiropraktikk med artikler basert på arbeidet til Dr. Heidi Haavik
          </p>
        </div>

        <div className="flex justify-center gap-6 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <ArticleColumn articles={firstColumn} duration={15} className="hidden md:block" />
          <ArticleColumn articles={secondColumn} duration={19} />
          <ArticleColumn articles={thirdColumn} duration={17} className="hidden lg:block" />
        </div>

        <div className="text-center mt-12">
          <a
            href="/forskning"
            className="inline-block px-8 py-3 bg-[#f48337] text-white font-medium rounded-lg hover:bg-[#f48337]/90 transition-colors"
          >
            Se Alle Artikler
          </a>
        </div>
      </div>
    </section>
  )
}
