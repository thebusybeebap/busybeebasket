import { ReactNode } from "react";
import { tv, type VariantProps } from 'tailwind-variants';

type Variant = "default" | "primary" | "footer";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  "default" : "",
  "primary" : "",
  "footer" : "",
}

export const bButtonStyles = tv({
  base: "hover:bg-gray-200 transition-all active:scale-90 cursor-pointer rounded-lg",
  variants: {
    type: {
      default: "",
      primary: "",
      footer: "",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
  },
});

export type BButtonVariants = VariantProps<typeof bButtonStyles>;

export interface BouncyButtonProps extends BButtonVariants {
  children?: React.ReactNode;
  onClick?: () => void
  className?: string; //for override
}

function BouncyButton({children, onClick, type, size, className}:BouncyButtonProps){  
  function clickHandler(){
    if(typeof onClick === "function"){
      onClick();
    }
  }

  return(
    <button
      onClick={clickHandler}
      className={bButtonStyles({type, size, className})}>
      {children}
    </button>
  );
}

export default BouncyButton;