import { tv, type VariantProps } from 'tailwind-variants';

export const bButtonStyles = tv({
  base: "active:bg-bb-sec bg-bb-base hover:bg-bb-sec active:opacity-50 transition-all active:scale-90 cursor-pointer touch-manipulation rounded-lg select-none border-2 border-bb-sec",
  variants: {
    type: {
      default: "",
      icononly: "",
      texticon: "flex-col gap-1 justify-center items-center active:outline-none active:ring-2 active:ring-bb-prim inline-flex",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      tl: "h-full",
      ty: "h-fit"
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
    bordered: true,
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