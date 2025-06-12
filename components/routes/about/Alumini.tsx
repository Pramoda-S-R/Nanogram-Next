import GridTeamList from "@/components/server/shared/GridTeamList";
import { getAluminiMembers } from "@/app/actions/api";

const Alumini = async () => {
  const alumini = await getAluminiMembers();

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-4xl font-extrabold text-base-content">
            Core Collective
          </h2>
          <p className="mt-6 text-base font-normal text-base-content/70">
            A tribute to the alumini who took Nanogram to greater heights.
          </p>
        </div>
        <GridTeamList teamMembers={alumini} />
      </div>
    </section>
  );
};

export default Alumini;
