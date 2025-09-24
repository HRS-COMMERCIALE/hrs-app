type NotFoundViewProps = {
  title: string;
  message: string;
  href: string;
  linkText: string;
};
import {Header404} from '@/components/layout/Header/index';

export default function NotFoundView({ title, message, href, linkText }: NotFoundViewProps) {
  return (
 <>
 <Header404 />
    <main className="">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      <a href={href} className="text-primary underline">{linkText}</a>
    </main></>
  );
}


