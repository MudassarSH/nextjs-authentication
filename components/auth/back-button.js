"use client"

import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button'

export const BackButton = ({href = '', label = ''}) => {
  return (
    <Button
    variant="link"
    size="lg"
    className="font-normal w-full"
    asChild 
    >
        <Link  href={href}>
        {label}
        </Link>
    </Button>
  );
};
