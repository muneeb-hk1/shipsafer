export default function Hero() {
  return (
    <>


      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute -left-20 -bottom-20 bg-gradient-to-r from-[#ec61df] via-[#ff70bf] to-[#ff4e54] h-[500px] w-[500px] blur-[240px] rounded-full"></div>
        <div className="h-full flex flex-col justify-center items-center gap-4">
          <h1 className="text-4xl md:text-6xl font-medium text-center md:leading-16 tracking-tight">Pushes to Production <br /> With <span className="bg-gradient-to-r from-[#ec61df] to-[#ff4e54] bg-clip-text text-transparent">ShipSafer</span></h1>
          <p className="text-center text-md md:text-lg text-gray-600">Automatically tests preview deployments and catches broken flows, <br /> API failures, and performance regressions before code reaches production.</p>
          <a href="https://github.com/apps/shipsaferauth/installations/new" target="_blank" rel="noopener noreferrer">
            Connect GitHub
          </a>
        </div>
      </section>
    </>
  );
}
