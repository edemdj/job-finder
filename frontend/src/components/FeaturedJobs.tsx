interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

const featuredJobs: Job[] = [
  {
    id: 1,
    title: 'Développeur Full Stack',
    company: 'Tech Solutions Bénin',
    location: 'Cotonou',
    type: 'CDI',
    salary: '400,000 - 600,000 FCFA',
    posted: 'Il y a 2 jours'
  },
  {
    id: 2,
    title: 'Chef de Projet Marketing',
    company: 'Digital Agency',
    location: 'Porto-Novo',
    type: 'CDI',
    salary: '350,000 - 500,000 FCFA',
    posted: 'Il y a 3 jours'
  },
  {
    id: 3,
    title: 'Commercial B2B',
    company: 'Global Trade SARL',
    location: 'Parakou',
    type: 'CDD',
    salary: '250,000 - 400,000 FCFA',
    posted: 'Il y a 1 jour'
  }
];

export default function FeaturedJobs() {
  return (
    <div className="space-y-4">
      {featuredJobs.map((job) => (
        <div
          key={job.id}
          className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{job.company}</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {job.type}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.salary}</span>
            <span>•</span>
            <span>{job.posted}</span>
          </div>
        </div>
      ))}
    </div>
  );
}