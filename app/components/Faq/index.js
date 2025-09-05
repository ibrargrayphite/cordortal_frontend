"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const Faq = ({ data }) => (
  <div className="container mx-auto lg:max-w-[960px] xxl:max-w-[1320px] px-4 my-8">
    <Accordion type="single" collapsible>
      {data.map((item, index) => (
        <AccordionItem
          value={`item-${index}`}
          key={index}
          className="mb-4 rounded-xl shadow-sm border border-gray-200 bg-white"
        >
          <AccordionTrigger
            className="px-4 py-2 text-lg md:text-lg text-base font-semibold flex justify-between items-center rounded-xl"
          >
            {item.headline}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-2 pt-0 text-base text-gray-700">
            {typeof item.content === "string" ? (
              <p>{item.content}</p>
            ) : (
              <ol className="pl-8">
                {item.content.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <strong>{subItem.headline}</strong>: {subItem.content}
                  </li>
                ))}
              </ol>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default Faq;
