import NotFoundView from '@/components/pages/notFound/NotFoundView';
export default function NotFound() {
  return (
    <NotFoundView
      title="Page not found"
      message="The page you are looking for doesn’t exist."
      href="/"
      linkText="Go back home"
    />
  );
}


