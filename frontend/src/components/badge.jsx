import { motion } from 'framer-motion';

export default function Badge({ img, title, i }) {
  return (
    <>
      <motion.div
        className="m-2 text-center"
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: i,
        }}
      >
        <img className="h-16 w-16 z-[1000]" src={img} />
        {/* {title} */}
      </motion.div>
    </>
  );
}
