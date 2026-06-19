"use client"

import React from 'react';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

// Props interface for type safety and clarity
interface LinkCardProps extends HTMLMotionProps<"a"> {
  title: string;
  description: string;
  imageUrl?: string;
  emoji?: string;
  icon?: React.ReactNode;
  centeredImage?: boolean;
  href: string;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, title, description, imageUrl, emoji, icon, centeredImage, href, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants: Variants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      },
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative flex h-80 w-full max-w-sm flex-col justify-between overflow-hidden',
          'rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Text content */}
        <div className="z-10">
          <h3 className="mb-2 text-3xl font-black uppercase tracking-tight text-card-foreground">
            {title}
          </h3>
          <p className="max-w-[80%] font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Image/Emoji container with a subtle scale effect on hover */}
        {(imageUrl || emoji || icon) && (
          <div className={cn(
            "order-first mb-4 h-24 w-24 flex-shrink-0 md:order-none md:absolute md:mb-0",
            centeredImage 
              ? "md:bottom-6 md:right-6 md:h-28 md:w-28 md:flex md:items-center md:justify-center" 
              : "md:bottom-0 md:right-0 md:h-48 md:w-48 md:translate-x-1/4 md:translate-y-1/4 md:transform"
          )}>
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={`${title} illustration`}
                className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
              />
            ) : icon ? (
              <motion.div 
                className="flex h-full w-full items-center justify-center p-2 md:p-6 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12"
              >
                {icon}
              </motion.div>
            ) : (
              <motion.span 
                className="flex h-full w-full items-center justify-center text-6xl md:text-8xl transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12"
              >
                {emoji}
              </motion.span>
            )}
          </div>
        )}
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
