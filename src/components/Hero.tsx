import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-none mb-10">
          Australia's Fuel Crisis
        </h1>

        <div className="space-y-3 text-lg md:text-xl mb-10">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Diesel has risen{' '}
            <span className="text-crisis-red font-bold font-heading text-2xl md:text-3xl">78%</span>{' '}
            in 21 days.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            Petrol is up{' '}
            <span className="text-crisis-red font-bold font-heading text-2xl md:text-3xl">$0.80/L</span>{' '}
            since February.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2 text-text-muted text-base md:text-lg mb-10"
        >
          <p>We import <span className="text-text-primary font-semibold">90%</span> of our fuel.</p>
          <p>We hold <span className="text-crisis-red font-semibold">32 days</span> of diesel.</p>
          <p>The international minimum is <span className="text-text-primary font-semibold">90</span>.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="space-y-1 text-text-muted"
        >
          <p className="text-text-primary font-semibold text-lg">
            This calculator shows what it's costing YOU,
          </p>
          <p>what your options are,</p>
          <p>and how to make your MP act.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-12 text-text-muted animate-bounce"
        >
          <span className="text-2xl">↓</span>
          <p className="text-sm mt-1">Start</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
